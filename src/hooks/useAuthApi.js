import { signUpUser } from "../services/authApi";
import { dbApi } from "../services/dbApi";

export const useAuthApi = () => {
  const signUp = async ({ email, password, role }) => {
    const data = await signUpUser(email, password);

    await dbApi.put(`users/${data.localId}/profile`, {
      email,
      role,
      createdAt: new Date().toISOString(),
    });

    return data;
  };

  return { signUp };
};
