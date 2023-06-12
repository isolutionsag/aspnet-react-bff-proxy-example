export interface AuthData {
  isAuthenticated: boolean;
  claims: Claim[];
  nameClaimType: string;
  roleClaimType: string;
  name: string;
  roles: string[];
}

interface Claim {
  type: string;
  value: string;
}
