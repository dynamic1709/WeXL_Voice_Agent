# Deployment & Production Guide

## Pre-Deployment Checklist

### Backend (Spring Boot)
- [ ] Password hashing implemented (BCrypt)
- [ ] CORS configured for production domain
- [ ] Environment variables set (no hardcoded credentials)
- [ ] Logging configured
- [ ] Error handling implemented
- [ ] Database backups configured
- [ ] SSL/TLS certificates obtained
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] API documentation generated

### Frontend (Angular)
- [ ] Build optimized: `npm run build`
- [ ] Environment variables configured for production
- [ ] API URL pointing to production backend
- [ ] Error messages user-friendly
- [ ] Loading states properly handled
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified
- [ ] Performance optimized
- [ ] Security headers configured

## Development to Production Migration

### Step 1: Backend Preparation

#### Update application.properties for Production
```properties
# Production Database Configuration
spring.datasource.url=jdbc:postgresql://prod-db-server:5432/users_prod
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Security
server.ssl.key-store=${KEYSTORE_PATH}
server.ssl.key-store-password=${KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12

# Logging
logging.level.root=WARN
logging.level.com.receptionist.backend=INFO
```

#### Implement Password Hashing
```java
// In UserService.java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public String registerUser(User user) {
        // Email validation
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered";
        }
        
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        userRepository.save(user);
        return "User registered successfully";
    }
}
```

#### Add Spring Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeRequests()
            .requestMatchers("/api/users/register").permitAll()
            .requestMatchers("/api/users/test").permitAll()
            .anyRequest().authenticated();
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://yourdomain.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Step 2: Frontend Preparation

#### Update environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

#### Build Optimized Version
```bash
ng build --configuration production
```

This creates:
- Minified JavaScript files
- Optimized CSS bundles
- Service worker for caching
- Tree-shaken dependencies
- Source maps (optional, for debugging)

### Step 3: Backend Deployment

#### Option 1: Docker Container (Recommended)
```dockerfile
FROM openjdk:17-slim

WORKDIR /app

COPY target/receptionist-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xmx512m"

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t receptionist-backend:latest .
docker run -d -p 8080:8080 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=your_password \
  -e DB_URL=jdbc:postgresql://postgres-server:5432/users \
  receptionist-backend:latest
```

#### Option 2: Traditional Server (Tomcat)
```bash
# Build WAR
mvn clean package -DskipTests

# Deploy to Tomcat
cp target/receptionist-backend.war $TOMCAT_HOME/webapps/

# Restart Tomcat
$TOMCAT_HOME/bin/shutdown.sh
$TOMCAT_HOME/bin/startup.sh
```

#### Option 3: Cloud Deployment (AWS, Azure, GCP)

**AWS Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p java-17

# Create environment
eb create production-env

# Deploy
eb deploy
```

### Step 4: Frontend Deployment

#### Option 1: CDN + Static Hosting (AWS S3 + CloudFront)
```bash
# Build
ng build --configuration production

# Upload to S3
aws s3 sync dist/receptionist-frontend/ s3://your-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Option 2: Nginx Web Server
```bash
# Build
ng build --configuration production

# Copy to Nginx
sudo cp -r dist/receptionist-frontend/* /var/www/html/

# Nginx configuration
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Option 3: Docker Container
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/receptionist-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t receptionist-frontend:latest .
docker run -d -p 80:80 receptionist-frontend:latest
```

## Production Configuration Checklist

### Security

```java
// Enable HTTPS only
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=strict

// Set security headers
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=always
```

### Database

```properties
# Connection pooling
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# Performance
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

### Monitoring & Logging

```properties
# Actuator for monitoring
management.endpoints.web.exposure.include=health,metrics,prometheus

# Structured logging
logging.pattern.json={"timestamp":"%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}","level":"%level","thread":"%thread","logger":"%logger{36}","message":"%message"}
```

## Monitoring & Maintenance

### Health Checks
```bash
# Backend health
curl https://api.yourdomain.com/actuator/health

# Database connectivity
curl https://api.yourdomain.com/actuator/health/db
```

### Logging & Debugging
```bash
# View backend logs
docker logs -f receptionist-backend

# View frontend logs (browser console)
# Press F12 → Console tab

# Check database
psql -U postgres -h prod-db-server -d users_prod
```

### Performance Monitoring
```bash
# CPU/Memory usage
top

# Disk space
df -h

# Database connections
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

## Troubleshooting Production Issues

### Problem: Frontend cannot reach backend
**Solution:**
1. Check firewall rules
2. Verify CORS configuration
3. Check backend logs: `docker logs container-id`
4. Test connectivity: `curl -v https://api.yourdomain.com/api/users/test`

### Problem: Slow API responses
**Solution:**
1. Check database query performance
2. Enable query caching
3. Optimize database indexes
4. Monitor server resources

### Problem: High memory usage
**Solution:**
1. Increase JVM memory: `JAVA_OPTS="-Xmx1024m -Xms512m"`
2. Implement connection pooling limits
3. Add pagination to queries
4. Monitor for memory leaks

### Problem: Database connection pool exhausted
**Solution:**
1. Check for long-running queries
2. Increase pool size in application.properties
3. Implement connection timeout
4. Monitor active connections

## Backup & Recovery

### Database Backup
```bash
# Full backup
pg_dump -U postgres users_prod > backup.sql

# Compressed backup
pg_dump -U postgres users_prod | gzip > backup.sql.gz

# Restore
psql -U postgres users_prod < backup.sql
```

### Scheduled Backup (Cron)
```bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh
```

## SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew (runs automatically)
sudo systemctl enable certbot.timer
```

### Import into Java Keystore
```bash
# Convert certificate to PKCS12
openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12

# Use in application.properties
server.ssl.key-store=file:/path/to/keystore.p12
server.ssl.key-store-password=your-password
server.ssl.key-store-type=PKCS12
```

## Performance Optimization

### Backend
- Implement response caching
- Use database query optimization
- Add pagination
- Implement compression

### Frontend
- Enable production mode
- Lazy load modules
- Compress assets
- Implement service worker
- Use CDN for static assets

## Scaling Strategy

### Horizontal Scaling
```yaml
# Docker Compose for multiple instances
version: '3'
services:
  backend-1:
    image: receptionist-backend:latest
    ports:
      - "8081:8080"
  backend-2:
    image: receptionist-backend:latest
    ports:
      - "8082:8080"
  load-balancer:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database
- Cache frequently accessed data

## Post-Deployment

1. **Verify Deployment**
   - Test all API endpoints
   - Verify database connectivity
   - Check SSL/TLS certificate
   - Test file uploads/downloads

2. **Monitor Performance**
   - Set up alerts
   - Monitor error rates
   - Check response times
   - Monitor resource usage

3. **User Communication**
   - Announce deployment
   - Provide support channel
   - Document known issues
   - Plan maintenance windows

## Disaster Recovery Plan

1. **Backup Strategy**
   - Daily incremental backups
   - Weekly full backups
   - Monthly archived backups
   - Store off-site

2. **Recovery Time Objective (RTO)**
   - Aim: < 1 hour
   - Document recovery procedures
   - Test recovery regularly

3. **Recovery Point Objective (RPO)**
   - Aim: < 1 hour of data loss
   - Implement transaction logging
   - Regular backup verification

## Conclusion

Following this guide ensures a smooth transition from development to production with security, reliability, and scalability in mind. Always test thoroughly before deploying to production!
