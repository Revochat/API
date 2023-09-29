import { v4, v5 } from "uuid"

export function generateUserToken () {
    return (v5(Date.now().toString(), v4()).split("-").join("") + Date.now()).toUpperCase()
}