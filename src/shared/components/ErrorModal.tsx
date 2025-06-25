import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import useTheme from '@/shared/hook/useTheme';

import IconByVariant from './IconByVariant';

interface ErrorModalProps {
  errorMessage?: string;
  onClose?: () => void;
  visible: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  errorMessage = undefined,
  onClose = undefined,
  visible,
}) => {
  const { t } = useTranslation();
  const { colors, fonts } = useTheme();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <IconByVariant
              height={42}
              path="fire"
              stroke={colors.red500}
              width={42}
            />
            <Text
              style={[
                fonts.gray800,
                fonts.bold,
                fonts.size_16_QuicksandSemiBold,
              ]}
            >
              {t('error_boundary.title')}
            </Text>
            <Text
              style={[
                fonts.gray800,
                fonts.size_14_BeVietnamProRegular,
                fonts.alignCenter,
              ]}
            >
              {errorMessage}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '60%',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
});

export default ErrorModal;
