import { MantineProviderProps } from "@mantine/core";
import { ModalsProviderProps } from "@mantine/modals";
import ModalConfirmDelete from "../components/Modal/ModalConfirmDelete";

export const mantineProviderProps: Omit<MantineProviderProps, "children"> = {
  theme: {
    fontFamily: "Poppins"
  }
};

export const modalProviderProps: Omit<ModalsProviderProps, "children"> = {
  modalProps: {
    closeOnClickOutside: false,
    zIndex: 901,
    overlayProps: {
      blur: 2
    },
    transitionProps: {
      exitDuration: 500
    }
  },

  modals: {
    confirmDelete: ModalConfirmDelete
  }
};
