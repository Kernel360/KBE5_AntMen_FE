import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SocialProfile {
  id: string;
  email: string;
  provider: string;
}

interface SocialProfileState {
  socialProfile: SocialProfile | null;
  isSocialSignup: boolean;
}

interface SocialProfileActions {
  setSocialProfile: (profile: SocialProfile | null) => void;
  clearSocialProfile: () => void;
}

const initialState: SocialProfileState = {
  socialProfile: null,
  isSocialSignup: false,
};

export const useSocialProfileStore = create<SocialProfileState & SocialProfileActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      setSocialProfile: (profile) => {
        set((state) => {
          state.socialProfile = profile;
          state.isSocialSignup = !!profile;
        });
      },
      clearSocialProfile: () => {
        set((state) => {
          state.socialProfile = null;
          state.isSocialSignup = false;
        });
      },
    })),
    {
      name: 'social-profile-storage', // storage-key
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
