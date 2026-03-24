'use strict';

module.exports = {
  ...require('./section-a-events-async.solution'),
  ...require('./section-b-api-service.solution'),
  ...require('./section-c-microservices.solution'),
  ...require('./section-d-performance-reliability.solution')
};

if (require.main === module) {
  console.log('Problem bank solution modules loaded.');
  console.log('Total exported symbols:', Object.keys(module.exports).length);
}
