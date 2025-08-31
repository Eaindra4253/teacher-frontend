import { ActionIcon, CopyButton, Flex, Text, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export function CopyText({ children }: { children: string }) {
  return (
    <CopyButton value={children}>
      {({ copied, copy }) => (
        <Flex gap="xs" align="center">
          <Tooltip
            color={copied ? "primary" : "dark"}
            label={copied ? "Copied" : "Copy"}
          >
            <ActionIcon size="sm" onClick={copy} variant="light">
              {copied ? (
                <IconCheck color="green" size={16} />
              ) : (
                <IconCopy size={16} />
              )}
            </ActionIcon>
          </Tooltip>
          <Text fw="bolder" c="primary" fz="sm">
            {children}
          </Text>
        </Flex>
      )}
    </CopyButton>
  );
}
