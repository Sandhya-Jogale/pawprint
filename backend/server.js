import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { sendMail } from './mailer.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    // Attempt a simple database query to verify connection
    let dbStatus = 'Not Connected';
    if (process.env.DATABASE_URL) {
      const result = await pool.query('SELECT NOW()');
      if (result.rows.length > 0) {
         dbStatus = 'Connected';
      }
    }

    res.json({ status: 'OK', dbStatus, message: 'Backend is running' });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ status: 'ERROR', dbStatus: 'Error connecting to database', message: err.message });
  }
});

// Create a Lost Pet Report
app.post('/api/pets/lost', async (req, res) => {
  try {
    const { 
      email, title, petType, breed, primaryColor, size, gender, features, 
      location_name, latitude, longitude, event_date, event_time, reward, additional_notes, image_url
    } = req.body;

    // Combine features, reward, and notes into the description field for now
    const description = `Type: ${petType}. Color: ${primaryColor}. Size: ${size}. Gender: ${gender}. Features: ${features}. Reward: ${reward}. Notes: ${additional_notes}`;

    // Combine date and time into a single timestamp
    // Assuming event_date is "YYYY-MM-DD" and event_time is "HH:MM"
    const eventTimestamp = event_date && event_time 
      ? new Date(`${event_date}T${event_time}:00Z`).toISOString() 
      : new Date().toISOString();

    // 1. Get user_id from email
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in database. Please log in again.' });
    }
    
    const user_id = userRes.rows[0].id;

    // 2. Insert into pet_alerts
    const insertQuery = `
      INSERT INTO pet_alerts 
      (user_id, alert_type, status, title, breed, description, location_name, latitude, longitude, event_time, image_url)
      VALUES ($1, 'LOST', 'ACTIVE', $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    
    const result = await pool.query(insertQuery, [
      user_id, title, breed, description, location_name, latitude || 40.7418, longitude || -73.9083, eventTimestamp, image_url || null
    ]);

    // Trigger area notifications
    dispatchAreaNotifications(result.rows[0]);
    // Check for potential matches
    findPotentialMatches(result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving lost pet report:', error);
    res.status(500).json({ error: 'Internal server error while saving report' });
  }
});

// Create a Sighting Report
app.post('/api/pets/sighting', async (req, res) => {
  try {
    const { 
      email, contact_name, contact_phone, 
      animal_type, condition, collar, size, gender, 
      location_name, latitude, longitude, event_date, event_time, additional_notes, image_url
    } = req.body;

    const title = animal_type || 'Unknown Animal Sighting';
    
    // In description, include guest contact info since user_id might be null
    const description = `Condition: ${condition}. Collar: ${collar}. Size: ${size}. Gender: ${gender}. Notes: ${additional_notes}. Reporter: ${contact_name || 'Anonymous'} (${contact_phone || 'No phone'})`;

    const eventTimestamp = event_date && event_time 
      ? new Date(`${event_date}T${event_time}:00Z`).toISOString() 
      : new Date().toISOString();

    let user_id = null;
    if (email) {
      const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userRes.rows.length > 0) {
        user_id = userRes.rows[0].id;
      }
    }

    const insertQuery = `
      INSERT INTO pet_alerts 
      (user_id, alert_type, status, title, breed, description, location_name, latitude, longitude, event_time, image_url)
      VALUES ($1, 'SIGHTING', 'ACTIVE', $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    
    const result = await pool.query(insertQuery, [
      user_id, title, title, description, location_name, latitude || 40.7418, longitude || -73.9083, eventTimestamp, image_url || null
    ]);

    // Trigger area notifications
    dispatchAreaNotifications(result.rows[0]);
    // Check for potential matches
    findPotentialMatches(result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving sighting report:', error);
    res.status(500).json({ error: 'Internal server error while saving sighting' });
  }
});

// Get all active alerts
app.get('/api/pets/active', async (req, res) => {
  try {
    const query = `
      SELECT * FROM pet_alerts 
      WHERE status = 'ACTIVE' 
      ORDER BY event_time DESC 
      LIMIT 20;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({ error: 'Internal server error while fetching alerts' });
  }
});

// Get all success stories (reunited)
app.get('/api/pets/success', async (req, res) => {
  try {
    const query = `
      SELECT * FROM pet_alerts 
      WHERE status = 'REUNITED' 
      ORDER BY reunited_time DESC 
      LIMIT 20;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ error: 'Internal server error while fetching success stories' });
  }
});

// Get a single pet alert by ID
app.get('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, u.full_name as reporter_name 
      FROM pet_alerts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1;
    `;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pet alert not found' });
    }
    
    const pet = result.rows[0];
    
    // Find potential matches dynamically for UI
    let potentialMatches = [];
    if (pet.latitude && pet.longitude) {
      const oppositeType = pet.alert_type === 'LOST' ? 'SIGHTING' : 'LOST';
      const matchQuery = `
        SELECT id, title, image_url, location_name, event_time, latitude, longitude
        FROM pet_alerts 
        WHERE status = 'ACTIVE' 
          AND alert_type = $1 
          AND id != $2
          AND latitude IS NOT NULL 
          AND longitude IS NOT NULL;
      `;
      const matchRes = await pool.query(matchQuery, [oppositeType, id]);
      
      potentialMatches = matchRes.rows.filter(candidate => {
        const distance = getDistanceKM(
          parseFloat(pet.latitude), 
          parseFloat(pet.longitude), 
          parseFloat(candidate.latitude), 
          parseFloat(candidate.longitude)
        );
        candidate.distance = distance; // add distance field for UI
        return distance <= 10.0;
      }).sort((a, b) => a.distance - b.distance).slice(0, 5); // Return top 5 closest matches
    }
    
    pet.potentialMatches = potentialMatches;
    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet details:', error);
    res.status(500).json({ error: 'Internal server error while fetching pet details' });
  }
});

// Get messages for a specific pet alert
app.get('/api/pets/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT m.*, u.full_name as sender_name 
      FROM alert_messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.alert_id = $1
      ORDER BY m.created_at ASC;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error while fetching messages' });
  }
});

// Post a new message to a pet alert
app.post('/api/pets/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, message } = req.body;
    
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }
    
    // Get user_id from email
    const userRes = await pool.query('SELECT id, full_name FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found. Please log in.' });
    }
    const user_id = userRes.rows[0].id;
    const sender_name = userRes.rows[0].full_name;

    // Insert message
    const insertQuery = `
      INSERT INTO alert_messages (alert_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [id, user_id, message]);
    
    // Return message with sender name for immediate UI update
    const newMessage = {
      ...result.rows[0],
      sender_name
    };
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'Internal server error while posting message' });
  }
});

// Get all alerts/sightings for a specific user by email
app.get('/api/pets/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // 1. Get user_id from email
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user_id = userRes.rows[0].id;

    // 2. Fetch reports for user_id
    const query = `
      SELECT * FROM pet_alerts 
      WHERE user_id = $1 
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ error: 'Internal server error while fetching your reports' });
  }
});

// Mark pet alert as REUNITED
app.patch('/api/pets/:id/reunited', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    const query = `
      UPDATE pet_alerts 
      SET status = 'REUNITED', reunited_time = CURRENT_TIMESTAMP, reunited_message = $1 
      WHERE id = $2 
      RETURNING *;
    `;
    
    const result = await pool.query(query, [message || 'Reunited successfully!', id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pet alert not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking as reunited:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a pet alert
app.delete('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM pet_alerts WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pet alert not found' });
    }
    
    res.json({ message: 'Pet alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet alert:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Distance calculation using Haversine formula (geodesic distance in km)
function getDistanceKM(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

// Dispatch area notifications to users within a 5km radius
async function dispatchAreaNotifications(petAlert) {
  try {
    const { id, alert_type, title, breed, description, location_name, latitude, longitude } = petAlert;
    
    // Find all users who have notifications enabled and have location configured
    const query = `
      SELECT id, full_name, email, latitude, longitude 
      FROM users 
      WHERE email_notifications = true 
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL;
    `;
    const res = await pool.query(query);
    const users = res.rows;
    
    const notifiedUsers = [];
    
    for (const user of users) {
      const distance = getDistanceKM(
        parseFloat(latitude), 
        parseFloat(longitude), 
        parseFloat(user.latitude), 
        parseFloat(user.longitude)
      );
      
      // If within 5.0 km, send alert
      if (distance <= 5.0) {
        notifiedUsers.push(user);
        
        // Send real email
        const htmlBody = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: ${alert_type === 'LOST' ? '#ef4444' : '#10b981'}; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px;">🚨 New ${alert_type} Pet Alert</h2>
            </div>
            <div style="padding: 20px; color: #374151;">
              <p>Hi ${user.full_name},</p>
              <p>A new animal alert has been reported within <strong>${distance.toFixed(2)} km</strong> of your alert zone!</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">${title} ${breed ? `(${breed})` : ''}</h3>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${location_name}</p>
                <p style="margin: 5px 0;"><strong>Details:</strong> ${description}</p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:3000/pet/${id}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Full Details & Map</a>
              </div>
              <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">If you have any sightings or information, please post a report or contact details immediately!<br><br>PawPrint Alert System 🐾</p>
            </div>
          </div>
        `;
        
        await sendMail(user.email, emailSubject, htmlBody);
        
        // Output to console and log file
        console.log(`Real Email Dispatched: ${emailSubject} to ${user.email}`);
      }
    }
    
    console.log(`📣 Dispatched area notifications to ${notifiedUsers.length} users within 5km!`);
  } catch (error) {
    console.error('Error dispatching area notifications:', error);
  }
}

// Get user settings by email
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const query = 'SELECT id, full_name, email, phone_number, email_notifications, push_notifications, sighting_alerts, latitude, longitude FROM users WHERE email = $1;';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      // Return default placeholder settings if user is not fully registered in PG yet
      return res.json({
        full_name: 'John Doe',
        email: email,
        phone_number: '(555) 123-4567',
        email_notifications: true,
        push_notifications: true,
        sighting_alerts: true,
        latitude: null,
        longitude: null
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user settings by email
app.put('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { 
      full_name, phone_number, 
      email_notifications, push_notifications, sighting_alerts,
      latitude, longitude 
    } = req.body;
    
    // Check if user exists first
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    let query;
    let params;
    
    if (userCheck.rows.length === 0) {
      // Insert new user if they don't exist yet (first time configuring settings)
      query = `
        INSERT INTO users (full_name, email, phone_number, email_notifications, push_notifications, sighting_alerts, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      params = [
        full_name || 'John Doe', email, phone_number || '', 
        email_notifications !== undefined ? email_notifications : true,
        push_notifications !== undefined ? push_notifications : true,
        sighting_alerts !== undefined ? sighting_alerts : true,
        latitude !== undefined ? latitude : null,
        longitude !== undefined ? longitude : null
      ];
    } else {
      // Update existing user
      query = `
        UPDATE users 
        SET full_name = $1, phone_number = $2, 
            email_notifications = $3, push_notifications = $4, sighting_alerts = $5,
            latitude = $6, longitude = $7
        WHERE email = $8
        RETURNING *;
      `;
      params = [
        full_name, phone_number, 
        email_notifications, push_notifications, sighting_alerts,
        latitude, longitude, email
      ];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Internal server error while saving settings' });
  }
});

// Smart Match Notification Algorithm
async function findPotentialMatches(newAlert) {
  try {
    const { id, alert_type, title, breed, location_name, latitude, longitude, user_id } = newAlert;
    
    if (!latitude || !longitude) return;

    // We look for opposite alert type
    const oppositeType = alert_type === 'LOST' ? 'SIGHTING' : 'LOST';
    
    // Query active alerts of the opposite type
    const query = `
      SELECT p.*, u.full_name, u.email
      FROM pet_alerts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'ACTIVE' 
        AND p.alert_type = $1 
        AND p.id != $2
        AND p.latitude IS NOT NULL 
        AND p.longitude IS NOT NULL;
    `;
    const res = await pool.query(query, [oppositeType, id]);
    const candidates = res.rows;
    
    const matches = [];
    for (const candidate of candidates) {
      const distance = getDistanceKM(
        parseFloat(latitude), 
        parseFloat(longitude), 
        parseFloat(candidate.latitude), 
        parseFloat(candidate.longitude)
      );
      
      // If within 10 km, consider it a match
      if (distance <= 10.0) {
        matches.push(candidate);
      }
    }
    
    // For each match, we send an email to the owner of the matching alert
    for (const match of matches) {
      // If the matched alert has no user (e.g., anonymous sighting), skip email
      if (!match.email) continue;
      
      const emailSubject = `🚨 SMART MATCH: Potential match for your ${match.alert_type} report!`;
      
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fde047; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f59e0b; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 20px;">✨ Potential Match Found!</h2>
          </div>
          <div style="padding: 20px; color: #374151;">
            <p>Hi ${match.full_name},</p>
            <p>Our Smart Match system found a new <strong>${newAlert.alert_type}</strong> report that might be related to your report "<strong>${match.title}</strong>"!</p>
            <p>This new report is located just <strong>${getDistanceKM(parseFloat(match.latitude), parseFloat(match.longitude), parseFloat(latitude), parseFloat(longitude)).toFixed(2)} km</strong> away.</p>
            <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fde047;">
              <h3 style="margin-top: 0; color: #92400e;">New Report Details:</h3>
              <p style="margin: 5px 0;"><strong>Type:</strong> ${newAlert.alert_type}</p>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${newAlert.title} ${newAlert.breed ? `(${newAlert.breed})` : ''}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${newAlert.location_name}</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/pet/${newAlert.id}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Investigate This Lead</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">PawPrint Alert System 🐾</p>
          </div>
        </div>
      `;
      
      // Send real email
      await sendMail(match.email, emailSubject, htmlBody);
      console.log(`Real Smart Match Dispatched: ${emailSubject} to ${match.email}`);
    }
    
    if (matches.length > 0) {
      console.log(`🔍 Smart Match found ${matches.length} potential matches for alert #${id}`);
      
      // Email the creator of the new alert as well!
      if (user_id) {
        const uRes = await pool.query('SELECT email, full_name FROM users WHERE id = $1', [user_id]);
        if (uRes.rows.length > 0) {
          const newAlertCreator = uRes.rows[0];
          const emailSubject = `✨ Good News: Potential matches found for your ${newAlert.alert_type} report!`;
          const htmlBody = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #10b981; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #10b981; padding: 20px; text-align: center; color: white;">
                <h2 style="margin: 0; font-size: 20px;">✨ Instant Matches Found!</h2>
              </div>
              <div style="padding: 20px; color: #374151;">
                <p>Hi ${newAlertCreator.full_name},</p>
                <p>We instantly scanned the area and found <strong>${matches.length}</strong> active reports that might match the ${newAlert.alert_type} you just submitted!</p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="http://localhost:3000/pet/${newAlert.id}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Matches Now</a>
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">PawPrint Alert System 🐾</p>
              </div>
            </div>
          `;
          await sendMail(newAlertCreator.email, emailSubject, htmlBody);
          console.log(`Real Smart Match Dispatched: ${emailSubject} to ${newAlertCreator.email}`);
        }
      }
    }
  } catch (error) {
    console.error('Error finding potential matches:', error);
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
