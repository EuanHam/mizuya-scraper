import mongoose, { InferSchemaType, Model, Schema, model, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        maxlength: 4,
    }],
    notificationPreferences: {
        type: Schema.Types.ObjectId,
        ref: "NotificationPreference",
    },
}, { timestamps: true });

export const User: Model<InferSchemaType<typeof userSchema>> = models.User ?? model("User", userSchema);

export default mongoose.models?.User || mongoose.model("User", userSchema);
