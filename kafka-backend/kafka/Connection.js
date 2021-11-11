var kafka = require("kafka-node");
const config = require("../config/config.js");
const ipAddress = config.SERVER_IP;
const port = config.KAFKA_PORT;
function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    this.client = new kafka.KafkaClient(`${ipAddress}:${port}`);
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 }
    ]);
    this.client.on("ready", function () {
      // console.log("client ready!");
    });

    return this.kafkaConsumerConnection;
  };

  //Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.KafkaClient(`${ipAddress}:${port}`);
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      // console.log("producer ready");
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider();
