// ============================================================================
// CREATIONAL DESIGN PATTERNS - EXERCISES
// ============================================================================

/**
 * EXERCISE 1: Factory Method - Logger Factory
 * 
 * Create a logging system with different log formats:
 * - JSONLogger: Logs in JSON format
 * - TextLogger: Logs in plain text
 * - XMLLogger: Logs in XML format
 * 
 * Requirements:
 * 1. Create a Logger interface with log(), warn(), error() methods
 * 2. Implement three concrete logger classes
 * 3. Create an abstract LoggerFactory with createLogger() factory method
 * 4. Create three concrete factory classes
 * 5. Demonstrate logging with different formats
 */

// TODO: Implement here

/**
 * EXERCISE 2: Abstract Factory - Cross-Platform UI
 * 
 * Create a cross-platform UI component library for Web, Mobile, and Desktop:
 * - Components: Button, Input, Modal
 * - Platforms: Web, Mobile (iOS/Android), Desktop (Windows/Mac)
 * 
 * Requirements:
 * 1. Define interfaces for Button, Input, Modal
 * 2. Implement concrete classes for each platform (9 total)
 * 3. Create UIFactory interface
 * 4. Implement WebUIFactory, MobileUIFactory, DesktopUIFactory
 * 5. Create Application class that uses factory to create UI
 * 6. Demonstrate creating UIs for all platforms
 */

// TODO: Implement here

/**
 * EXERCISE 3: Builder - SQL Query Builder
 * 
 * Create a type-safe SQL query builder with fluent interface:
 * - Support SELECT, INSERT, UPDATE, DELETE operations
 * - Support WHERE clauses with AND/OR
 * - Support JOIN operations
 * - Support ORDER BY and LIMIT
 * 
 * Requirements:
 * 1. Create SQLQuery class to hold query data
 * 2. Create QueryBuilder with fluent methods
 * 3. Implement method chaining
 * 4. Add validation (e.g., SELECT needs table)
 * 5. Build final query string
 * 6. Demonstrate building complex queries
 * 
 * Example:
 * const query = QueryBuilder
 *   .select('id', 'name', 'email')
 *   .from('users')
 *   .where('age > 18')
 *   .and('country = "USA"')
 *   .orderBy('name', 'ASC')
 *   .limit(10)
 *   .build();
 */

// TODO: Implement here

/**
 * EXERCISE 4: Prototype - Game Character Cloning
 * 
 * Create a game character system with deep cloning:
 * - Character has: name, health, mana, inventory, skills, equipment
 * - Inventory is array of items
 * - Equipment has: weapon, armor, accessories
 * - Skills is array of Skill objects with cooldowns
 * 
 * Requirements:
 * 1. Create Character, Equipment, Skill classes
 * 2. Implement deep clone() method
 * 3. Create CharacterRegistry to store template characters
 * 4. Create templates: Warrior, Mage, Rogue
 * 5. Clone characters and modify independently
 * 6. Verify changes don't affect prototypes
 */

// TODO: Implement here

/**
 * EXERCISE 5: Singleton - Application Configuration
 * 
 * Create a thread-safe configuration manager with:
 * - Environment-specific configs (dev, staging, prod)
 * - Feature flags
 * - API endpoints
 * - Validation rules
 * 
 * Requirements:
 * 1. Implement singleton pattern
 * 2. Load config based on environment
 * 3. Support get/set/has methods
 * 4. Support nested config keys (e.g., 'api.baseUrl')
 * 5. Add validation for required keys
 * 6. Prevent external instantiation
 * 7. Make it async-safe
 * 
 * Bonus: Implement as module singleton for modern approach
 */

// TODO: Implement here

/**
 * EXERCISE 6: Combined Patterns - Plugin System
 * 
 * Create a plugin architecture using multiple creational patterns:
 * - Factory Method for creating plugins
 * - Builder for plugin configuration
 * - Singleton for plugin registry
 * - Prototype for cloning plugin instances
 * 
 * Requirements:
 * 1. Create Plugin interface with init(), execute(), destroy()
 * 2. Implement concrete plugins: AuthPlugin, LoggingPlugin, CachePlugin
 * 3. Use Factory Method for plugin creation
 * 4. Use Builder for plugin configuration
 * 5. Use Singleton for PluginRegistry
 * 6. Support cloning configured plugins
 * 7. Demonstrate complete plugin lifecycle
 */

// TODO: Implement here

/**
 * EXERCISE 7: Factory with Generics - Data Serializer Factory
 * 
 * Create a type-safe serializer factory using generics:
 * - Support JSON, XML, YAML, Binary formats
 * - Type-safe serialization/deserialization
 * - Format detection from file extension
 * 
 * Requirements:
 * 1. Create Serializer<T> interface with serialize/deserialize
 * 2. Implement serializers for each format
 * 3. Create SerializerFactory with generic methods
 * 4. Support format auto-detection
 * 5. Handle errors gracefully
 * 6. Demonstrate with different data types
 */

// TODO: Implement here

/**
 * EXERCISE 8: Abstract Factory - Theme System
 * 
 * Create a comprehensive theming system:
 * - Themes: Light, Dark, HighContrast, Custom
 * - Components: Colors, Fonts, Spacing, Icons
 * 
 * Requirements:
 * 1. Define interfaces for each component type
 * 2. Implement theme families
 * 3. Create ThemeFactory for each theme
 * 4. Support theme switching at runtime
 * 5. Apply themes to UI components
 * 6. Support custom theme creation
 */

// TODO: Implement here

/**
 * EXERCISE 9: Builder with Validation - Form Builder
 * 
 * Create a form builder with validation rules:
 * - Field types: Text, Email, Number, Select, Checkbox
 * - Validation: Required, MinLength, MaxLength, Pattern, Custom
 * - Support field groups and nested forms
 * 
 * Requirements:
 * 1. Create Field class with validation
 * 2. Create FormBuilder with fluent interface
 * 3. Add validation methods
 * 4. Support conditional fields
 * 5. Generate form schema
 * 6. Validate form data
 */

// TODO: Implement here

/**
 * EXERCISE 10: Prototype Registry - Template Manager
 * 
 * Create a document template manager:
 * - Templates: Invoice, Receipt, Report, Letter
 * - Support versioning
 * - Support template inheritance
 * - Support template customization
 * 
 * Requirements:
 * 1. Create Template class with clone()
 * 2. Implement TemplateRegistry
 * 3. Support template versioning
 * 4. Implement template inheritance
 * 5. Allow template customization
 * 6. Demonstrate creating documents from templates
 */

// TODO: Implement here

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/*
For each exercise, verify:
✅ Pattern correctly implemented
✅ Type safety maintained
✅ Proper encapsulation
✅ Interface segregation
✅ Dependency injection used where appropriate
✅ Error handling included
✅ Code is testable
✅ Examples demonstrate usage

Run examples to ensure they work:
- Factory Method creates correct instances
- Abstract Factory creates consistent families
- Builder creates valid objects
- Prototype clones deeply
- Singleton maintains single instance
*/
