"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useIsDark } from "@skygenesisenterprise/react-sds/useIsDark";
import { createModal } from "@skygenesisenterprise/react-sds/Modal";
import { useIsModalOpen } from "@skygenesisenterprise/react-sds/Modal/useIsModalOpen";
import { useIsHeaderMenuModalOpen } from "@skygenesisenterprise/react-sds/Header/useIsHeaderMenuModalOpen";

export function ClientComponent() {

  const { isDark } = useIsDark();

  const isModalOpen = useIsModalOpen(modal);

  const isHeaderMenuModalOpen = useIsHeaderMenuModalOpen();

  console.log(`Modal ${modal.id} is currently: ${isModalOpen ? "open" : "closed"}`);
  console.log(`Header Modal is currently: ${isHeaderMenuModalOpen ? "open" : "closed"}`);

  return (
    <>
      <Stack spacing={2} direction="row" sx={{ mt: 5 }}>
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
      <p>Is dark? {isDark ? "yes" : "no"}</p>
      <Button onClick={modal.open}>Open client modal</Button>
      <modal.Component title="Client modal">
        <p>Client modal content</p>
        <button onClick={modal.close}>Close</button>
      </modal.Component>
    </>
  );
}

const modal = createModal({
  "isOpenedByDefault": false,
  "id": "client-modal"
});