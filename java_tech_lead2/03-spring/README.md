# Spring Framework and Spring Boot

This module covers Spring ecosystem essentials for enterprise Java development.

## Module Structure

### 01-core - Spring Core and Dependency Injection
- **IoC Container**: ApplicationContext, bean lifecycle, scopes
- **Dependency Injection**: Constructor, setter, field injection patterns
- **Configuration**: XML, annotation-based, Java configuration
- **AOP**: Aspect-oriented programming, cross-cutting concerns

### 02-mvc - Spring MVC and RESTful Services  
- **Web MVC**: Controllers, request mapping, data binding
- **REST APIs**: RESTful design, HTTP methods, status codes
- **Exception Handling**: Global exception handlers, custom exceptions
- **Validation**: Bean validation, custom validators

### 03-data - Spring Data and Database Integration
- **Spring Data JPA**: Repository pattern, query methods
- **Transaction Management**: @Transactional, propagation, isolation
- **Database Connectivity**: DataSource configuration, connection pooling
- **Caching**: Spring Cache abstraction, cache providers

### 04-security - Spring Security Fundamentals
- **Authentication**: Username/password, JWT, OAuth2
- **Authorization**: Role-based access control, method security  
- **Web Security**: CSRF protection, CORS configuration
- **Security Best Practices**: Password encoding, session management

### 05-boot - Spring Boot Features and Auto-configuration
- **Starter Dependencies**: Web, data, security starters
- **Auto-configuration**: Conditional beans, property binding
- **Actuator**: Health checks, metrics, application monitoring
- **Profiles**: Environment-specific configuration

### 06-testing - Spring Testing Framework
- **Integration Testing**: @SpringBootTest, test slices
- **Unit Testing**: Mocking with @MockBean, test contexts
- **Web Layer Testing**: MockMvc, WebTestClient
- **Database Testing**: @DataJpaTest, TestContainers

## Quick Start

```powershell
# Navigate to Spring module
cd d:\GitHub_Src\Interview\java_tech_lead2\03-spring

# Each section contains runnable examples
cd 01-core
javac -cp "lib/*" *.java
java -cp ".:lib/*" Example_SpringCore

# Spring Boot examples (require Maven/Gradle)
cd 05-boot
mvn spring-boot:run
```

## Prerequisites

- Java 17+
- Maven or Gradle build tool
- Spring Boot CLI (optional)
- IDE with Spring support (IntelliJ IDEA, Eclipse STS)

## Learning Path

1. **Spring Core** - Understanding IoC and DI fundamentals
2. **Spring MVC** - Building web applications and REST APIs  
3. **Spring Data** - Database integration and repository patterns
4. **Spring Security** - Authentication and authorization
5. **Spring Boot** - Rapid application development
6. **Testing** - Comprehensive testing strategies

Each module includes complete working examples, best practices, and common interview scenarios.