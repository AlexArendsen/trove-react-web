import React, { useMemo } from "react";
import { Flex } from "../../components/Flex/Flex";
import { Logo } from "../../components/Logo/Logo";

export const LoadingScreen = React.memo(() => {

	return (
		<Flex column center style={{ height: '100vh', width: '100%' }}>
			<Logo large variant='gradient' />
		</Flex>
	)

})