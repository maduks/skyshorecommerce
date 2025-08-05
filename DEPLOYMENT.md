# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secure JWT secret key
- [ ] `NODE_ENV` - Set to "production"

### 2. Database
- [ ] MongoDB Atlas cluster is running
- [ ] Database connection string is correct
- [ ] Network access is configured (0.0.0.0/0 for Vercel)

### 3. Code Changes
- [ ] `vercel.json` is present
- [ ] `server.js` exports the app
- [ ] All routes are working locally
- [ ] No hardcoded localhost URLs

### 4. Dependencies
- [ ] All dependencies are in `package.json`
- [ ] No dev dependencies in production
- [ ] Node.js version is specified (>=18.0.0)

## 🚀 Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Set Environment Variables
In Vercel dashboard:
- Go to your project
- Settings → Environment Variables
- Add all required variables

### 5. Test Deployment
```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test main endpoint
curl https://your-app.vercel.app/
```

## 🔧 Post-Deployment

### 1. Test All Endpoints
- [ ] Authentication endpoints
- [ ] Product endpoints
- [ ] Order endpoints
- [ ] Category endpoints

### 2. Monitor Logs
- Check Vercel function logs
- Monitor MongoDB connections
- Watch for any errors

### 3. Performance
- [ ] API response times
- [ ] Database query performance
- [ ] Memory usage

## 🐛 Common Issues

### 1. MongoDB Connection
- Ensure MongoDB Atlas allows connections from Vercel
- Check connection string format
- Verify network access settings

### 2. Environment Variables
- Double-check variable names
- Ensure no typos in values
- Redeploy after adding variables

### 3. CORS Issues
- Frontend domain should be in CORS settings
- Check if CORS is properly configured

### 4. File Upload Issues
- Multer might need configuration for serverless
- Consider using cloud storage instead

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Test endpoints individually
3. Verify environment variables
4. Check MongoDB connection 