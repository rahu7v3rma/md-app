import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import PdfView from 'react-native-pdf';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { CrossIcon } from '@/assets/svgs';
import { Text } from '@/shared';

export type PdfViewerHandle = {
    open: (pdfUri: string, pdfName: string) => void;
};

const PdfViewer = forwardRef<PdfViewerHandle>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [uri, setUri] = useState('');
    const [name, setName] = useState('');
    useImperativeHandle(ref, () => ({
        open: (pdfUri, pdfName) => {
            setUri(pdfUri);
            setName(pdfName);
            setVisible(true);
        }
    }));
    return (
        <Modal visible={visible}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.crossIcon}
                            onPress={() => setVisible(false)}
                        >
                            <CrossIcon />
                        </TouchableOpacity>
                        <Text fontWeight="700">{name}</Text>
                    </View>
                    <PdfView
                        source={{ uri }}
                        style={styles.pdfView}
                        trustAllCerts={false}
                    />
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center'
    },
    crossIcon: { position: 'absolute', left: 10 },
    pdfView: { flex: 1 }
});

export default PdfViewer;
