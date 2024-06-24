const mongoose = require('mongoose');

const dynamicSchema = new mongoose.Schema({
    symbol: { type: String , unique : true}
}, { strict: false });

const DynamicModel = mongoose.model('Dynamic', dynamicSchema);

module.exports = DynamicModel;