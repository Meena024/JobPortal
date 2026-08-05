import { dbApi } from "../services/dbApi";

export const setRoleDb = (userId, email, role) => async (dispatch) => {
  try {
    await dbApi.put(
      `users/${userId}/profile`,

      {
        email,
        role,
        createdAt: new Date().toISOString(),
      },
    );
  } catch (err) {
    console.error(err);
  }
};
