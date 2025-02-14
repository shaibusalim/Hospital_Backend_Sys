const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');



// User Signup 
const signUp = async(req, res) => {
  const { name, email, password, role, doctorId } = req.body;
  
  try {

     // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

       // Secure password hashing
       const salt = await bcrypt.genSalt(12);
       const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({ name, email, password: hashedPassword, role });

     // Assign user to Patient or Doctor table
     if (role === 'doctor') {
      await Doctor.create({ userId: user.id });
    } else if (role === 'patient') {
      // Check if doctorId exists before assigning the patient to a doctor
      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor) {
        return res.status(400).json({ message: 'Doctor not found. Please select a valid doctor.' });
      }

      await Patient.create({ userId: user.id, doctorId: doctorId });
    }

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User Login 
const logIn = async (req, res) => {

  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


     // Store token securely in a cookie
     res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
      });

      
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    signUp,
    logIn
};