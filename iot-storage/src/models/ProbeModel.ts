import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;


export const ProbeSchema = new Schema({ probe: Schema.Types.Mixed, epoch: Schema.Types.Date });
