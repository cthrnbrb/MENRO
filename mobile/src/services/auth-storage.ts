import AsyncStorage from "@react-native-async-storage/async-storage";

let token: string | null = null;
let tokenLoaded = false;

export async function setToken(newToken: string | null): Promise<void> {
  token = newToken;
  tokenLoaded = true;

  if (token !== null) {
    await AsyncStorage.setItem("token", token);
  } else {
    await AsyncStorage.removeItem("token");
  }
}

export async function getToken(): Promise<string | null> {
  if (tokenLoaded) {
    return token;
  }

  token = await AsyncStorage.getItem("token");
  tokenLoaded = true;
  return token;
}
