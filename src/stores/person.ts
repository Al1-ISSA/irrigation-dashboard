import { create } from 'zustand'

interface GenerationState{
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}


export const useGenerationStore = create<GenerationState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}))