import {startBot} from "./ds_bot/bot.service.ts";
import {connectDB} from "./utils/mongodb.ts";


await connectDB();

startBot()

