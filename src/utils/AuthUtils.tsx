// src/utils/AuthUtils.tsx
import { getData } from './Storage';

export const hasRole = async (roleSlug) => {
  const roles = await getData('userRoles');
  if (roles) {
    const rolesArray = JSON.parse(roles);
    return rolesArray.some(role => role.slug === roleSlug);
  }
  return false;
};

export const getUserData = async () => {
  const userData = await getData('userData');
  return userData ? JSON.parse(userData) : null;
};
