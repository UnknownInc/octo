import express from 'express';
import {auth, db} from '../services/firebase.js';
import {requireAuth, requireUser} from '../services/auth.js';
import md5 from 'md5';

const api = express.Router();


api.get('/:id', requireAuth, async (req, res)=>{
  const eid = req.params.eid.toLowerCase();
  const config = req.app.config;
  try {
    const docRef = db().collection(`/${config.EVENTDB}`).doc(id);

    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).send();
    }

    return res.json(snapshot.data);

  } catch (e) {
    return res.status(500).send();
  }
})

module.exports = api;