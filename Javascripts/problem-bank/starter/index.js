'use strict';

module.exports = {
  ...require('./section-a-events-async.starter'),
  ...require('./section-b-api-service.starter'),
  ...require('./section-c-microservices.starter'),
  ...require('./section-d-performance-reliability.starter')
};

if (require.main === module) {
  console.log('Problem bank starter modules loaded.');
  console.log('Complete TODOs in section files under starter/.');
}
