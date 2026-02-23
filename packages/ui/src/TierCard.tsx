import React from 'react';
import { Box, Text, Icon } from '@chakra-ui/react';
import { FaLock, FaCheckCircle, FaCrown, FaGift } from 'react-icons/fa';

export interface TierCardProps {
  id: string;
  title: string;
  status: string;
  xp: number;
  reward: string;
  claimed: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
}

export const TierCard: React.FC<TierCardProps> = ({
  id,
  title,
  status,
  xp,
  reward,
  claimed,
  isCurrent = false,
  onClick,
}) => {
  let statusIcon = <Icon as={FaLock} color="gray.400" boxSize={6} />;
  let cardBg = 'gray.50';
  let borderColor = 'gray.200';
  let titleColor = 'gray.700';
  let rewardIcon = <Icon as={FaGift} color="yellow.400" boxSize={5} mr={1} />;
  if (claimed) {
    statusIcon = <Icon as={FaCheckCircle} color="teal.400" boxSize={6} />;
    cardBg = 'teal.50';
    borderColor = 'teal.400';
    titleColor = 'teal.700';
  } else if (status === 'Unlocked') {
    statusIcon = <Icon as={FaCrown} color="yellow.400" boxSize={6} />;
    cardBg = 'yellow.50';
    borderColor = 'yellow.400';
    titleColor = 'yellow.700';
  }
  if (isCurrent) {
    borderColor = 'blue.500';
  }
  return (
    <Box
      p={4}
      borderWidth={2}
      borderRadius="lg"
      minW="140px"
      bg={cardBg}
      borderColor={borderColor}
      textAlign="center"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      _hover={onClick ? { boxShadow: 'lg', bg: 'blue.50' } : {}}
      transition="box-shadow 0.2s, background 0.2s"
      boxShadow={claimed ? 'md' : 'sm'}
      position="relative"
    >
      <Box mb={2}>{statusIcon}</Box>
      <Text fontWeight="bold" color={titleColor} fontSize="lg">{title}</Text>
      <Box display="flex" justifyContent="center" alignItems="center" mt={1} mb={1} gap={1}>
        {rewardIcon}
        <Text fontSize="sm" color="gray.600">{reward}</Text>
      </Box>
      <Text fontSize="xs" color="gray.500" mt={1}>XP: {xp}</Text>
      {isCurrent && <Box position="absolute" top={1} right={1} bg="blue.500" borderRadius="full" w={3} h={3} />}
    </Box>
  );
};
