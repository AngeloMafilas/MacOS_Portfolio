import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '../components/constants';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useWindowsStore = create(
    immer((set) => ({
        windows: WINDOW_CONFIG,
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey, data = null) => set((state) => {
            const window = state.windows[windowKey];
            if (!window) return;
            
            window.isOpen = true;
            window.zIndex = state.nextZIndex;
            window.data = data ?? window.data;
            state.nextZIndex++;
        }),

        closeWindow: (windowKey) => set((state) => {
            const window = state.windows[windowKey];
            if (!window) return;

            window.isOpen = false;
            window.zIndex = INITIAL_Z_INDEX;
            window.data = null;
        }),

        focusWindow: (windowKey) => set((state) => {
            const window = state.windows[windowKey];
            if (!window) return;

            window.zIndex = state.nextZIndex++;
        }),
    }))
);

export default useWindowsStore;