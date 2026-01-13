import { Webhook } from "svix";
import User from "../models/user.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // Use the raw body (captured by express.json verify) for signature verification.
    // If rawBody isn't available, fall back to the stringified parsed body.
    const raw = req.rawBody || JSON.stringify(req.body);
    await whook.verify(
      raw,
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"]
      }
    );

    // payload for processing -- prefer parsed body if available
    const payload = req.body && Object.keys(req.body).length ? req.body : JSON.parse(raw);
    const { data, type } = payload;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        res.json({});
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
