import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, ListItem, CheckBox, Button } from '@ui-kitten/components';

import { Dropdown } from 'react-native-paper-dropdown';
import { Dialog, Portal, Text } from 'react-native-paper';

import { loginContext } from '../context/context';

export const Inventory = () => {
    const { nameProductsInventory = [] } = useContext(loginContext);  // Set default value if undefined
    const [products, setProducts] = useState([])
    const [gender, setGender] = useState();
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)

    // State to manage checkbox and select state for each item
    const [checkedItems, setCheckedItems] = useState(
        new Array(nameProductsInventory.length).fill(false)
    );
    
    // Handle checkbox change
    const handleCheckboxChange = (index) => {
        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = !updatedCheckedItems[index];
        setCheckedItems(updatedCheckedItems);

        let currenProducts = [...products]; // Copiamos los productos actuales"
        console.log(currenProducts, "current produuct")

        const productExists = currenProducts.find(product => product.name === nameProductsInventory[index]);

        if (updatedCheckedItems[index]) {
            // Si el checkbox está marcado y el producto no está en la lista, lo agregamos
            if (!productExists) {
                const newProduct = {
                    name: nameProductsInventory[index],
                    quantity: 1
                };
                currenProducts.push(newProduct);
            }
        } else {
            // Si el checkbox se desmarca, eliminamos el producto de la lista
            currenProducts = currenProducts.filter(product => product.name !== nameProductsInventory[index]);
        }

        setProducts(currenProducts);
        setModalVisible(true)
    };

    const OPTIONS = Array.from({ length: 30 }, (_, i) => ({
        label: (i + 1).toString(), // Texto que se muestra en el dropdown
        value: i + 1               // Valor que se selecciona
    }));

    // Render the checkbox and select for each item
    const renderItemAccessory = (index) => {
        return (
            <View style={{ width: 1000, borderWidth: 1 }}>
                <CheckBox
                    status="primary"
                    checked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                />
            </View>

        )
    };

    // Render each item of the list
    const renderItem = ({ item, index }) => (
        <>
            <View style={{ display: "flex" }}>
                <ListItem
                    title={`${item}`}
                    accessoryRight={renderItemAccessory(index)}
                    style={{ display: "flex", flexDirection: "row" }}
                />
            </View>
        </>

    );


    const DialogModal = () => {
         const [visible, setVisible] = useState(false); // Estado para controlar la visibilidad del Dialog

         console.log(modalVisible, "modal visible")

        const hideDialog = () => setModalVisible(false); 

        return (
            <>
                <Portal>
                    <Dialog visible={modalVisible} onDismiss={hideDialog} style={{height:300, padding:20}}>
                        <Dropdown
                            label="Piezas"
                            placeholder="Selecciona piezas"
                            options={OPTIONS}
                            value={gender}
                            onSelect={setGender}
                            mode='outlined'
                        />
                        <Dialog.Actions style={{position: "absolute", bottom: 0, right:0}}>
                            <Button onPress={() => setModalVisible(false)}>Agregar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </>
        );
    };


    useEffect(() => {
        console.log(products, "todos los productos")
    }, [products])


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventory</Text>
            <List
                style={styles.list}
                data={nameProductsInventory}
                renderItem={renderItem}
            />
            <DialogModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '800',
        marginVertical: 20,
    },
    list: {
        marginTop: 20,
    },
    select: {
        width: 120,
    },
});
