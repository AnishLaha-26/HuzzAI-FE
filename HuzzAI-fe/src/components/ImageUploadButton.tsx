import { useState, useRef } from 'react';
import { Image, Platform, TouchableOpacity, View, StyleSheet, Modal, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ImageUploadButton = ({ onImageSelect }: { onImageSelect: (uri: string) => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelect(result.assets[0].uri);
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Upload Screenshot</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={pickImage}
            >
              <Text style={styles.optionText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#4a4a4a',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#007AFF',
  },
  cancelButton: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  cancelText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});
