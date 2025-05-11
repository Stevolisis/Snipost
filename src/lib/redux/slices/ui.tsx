import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isInspectionPanel: true,
    picker:"",
    isToolbar: true,
    isArtboards: false,
    isBottomToolbar: true,
    isCodeEditor: false,
    appHeight: "600px",
    action: 'Select'
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
      setInspectionPanel(state,{ payload }) {
        state.isInspectionPanel = payload;
      },
      setPicker(state, { payload }) {
        state.picker = payload;
      },
      setIsToolbar(state, { payload }) {
        state.isToolbar = payload;
      },
      setIsArtboards(state, { payload }) {
        state.isArtboards = payload;
      },
      setIsBottomToolbar(state, { payload }) {
        state.isBottomToolbar = payload;
      },
      setIsCodeEditor(state, { payload }) {
        state.isCodeEditor = payload;
      },
      setAppHeight(state,{ payload }) {
        state.appHeight = `${payload - 65}px`;
      },
      setAction(state, { payload }) {
        state.action = payload;
      },
    }
});

export const { setInspectionPanel, setPicker, setIsToolbar, setIsArtboards, setIsBottomToolbar, setIsCodeEditor, setAppHeight, setAction} = uiSlice.actions;
export default uiSlice.reducer;