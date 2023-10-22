import { generateUserId } from "./ID";
import { generateUserToken } from "./TOKEN";

export default {
    ID: generateUserId(),
    TOKEN: generateUserToken()
}