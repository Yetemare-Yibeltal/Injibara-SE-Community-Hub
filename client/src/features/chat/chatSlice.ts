import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MessageDTO } from "@shared/types";

interface ChatUiState {
  activeChatId: string | null;
  typingUsers: Record<string, string[]>;
}

const initialState: ChatUiState = {
  activeChatId: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: "chatUi",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },
    setUserTyping: (
      state,
      action: PayloadAction<{
        chatId: string;
        userId: string;
        isTyping: boolean;
      }>,
    ) => {
      const { chatId, userId, isTyping } = action.payload;
      const current = state.typingUsers[chatId] || [];

      if (isTyping) {
        state.typingUsers[chatId] = Array.from(new Set([...current, userId]));
      } else {
        state.typingUsers[chatId] = current.filter((id) => id !== userId);
      }
    },
  },
});

export const { setActiveChat, setUserTyping } = chatSlice.actions;
export default chatSlice.reducer;

export type { MessageDTO };
