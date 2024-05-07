import {create} from "zustand";
import {persist} from "zustand/middleware";
type FamilyStore = {
    familyId: string;
    setFamilyId: (newId: string) => void;
    familyName: string;
    setFamilyName: (newName: string) => void;
    familyImage: string | ArrayBuffer | null;
    setFamilyImage: (newImage: string | ArrayBuffer | null) => void;
    familyCode: string;
    setFamilyCode: (newCode: string) => void;
}

export const useFamilyStore = create<FamilyStore>()(
    persist(
    (set) => ({
        familyId: "",
        setFamilyId: (newId: string) => set({ familyId: newId }),
        familyName: "예빈이네",
        setFamilyName: (newName: string) => set({ familyName: newName }),
        familyImage: null,
        setFamilyImage: (newImage: string | ArrayBuffer | null) => set({familyImage: newImage}),
        familyCode: "",
        setFamilyCode: (newCode: string) => set({ familyCode: newCode }),
    }),
    {
        name: "family",
    }
)
);