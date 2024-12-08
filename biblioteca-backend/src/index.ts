import express from 'express'
import sequelize from './config/db'
import userRoutes from './routes/user-routes'
import bookRoutes from './routes/book-routes'
import waitlistRoutes from './routes/waitlist-routes'
import notificationRoutes from './routes/notification-routes'
import loanRoutes from './routes/loan-routes'
import authRoutes from './routes/auth-routes'
import cors from "cors";

const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }));

app.use('/api/auth', authRoutes)
app.use('/api', userRoutes)
app.use('/api', bookRoutes)
app.use('/api', loanRoutes)
app.use('/api', waitlistRoutes)
app.use("/api", notificationRoutes);


const PORT = 3000

const Run = async () =>{
  try {
    
    const connection = await sequelize.sync({force: false})
    
    if(connection)
    {
        console.log('Database synced successfully');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
    } catch (error) {
      console.error("Failed to sync database", error)  
    }
};

Run();