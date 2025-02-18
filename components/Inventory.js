import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, RefreshControl, FlatList, Linking } from 'react-native';
import { List, ListItem, CheckBox, Button } from '@ui-kitten/components';
import { Dropdown } from 'react-native-paper-dropdown';
import { Dialog, Portal, Text } from 'react-native-paper';
import { loginContext } from '../context/context';

export const Inventory = () => {
    const { nameProductsInventory = [], newOrder, setNewOrderProducts, setNewOrder, getNewOrderProducts,removeAllOrderProducts } = useContext(loginContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState(
        new Array(nameProductsInventory.length).fill(false)
    );
    const [selectedQuantity, setSelectedQuantity] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const OPTIONS = Array.from({ length: 30 }, (_, i) => ({
        label: (i + 1).toString(),
        value: i + 1,
    }));

    useEffect(() => {
        const updatedCheckedItems = nameProductsInventory.map((product, index) => {
            const orderItem = newOrder.find(item => item.name === product.name);
            return orderItem && orderItem.selected === true;
        });

        setCheckedItems(updatedCheckedItems);
    }, [newOrder, nameProductsInventory]);

    const handleCheckboxChange = (index) => {
        if (!nameProductsInventory || nameProductsInventory.length === 0) {
            console.error('nameProductsInventory is empty or undefined');
            return;
        }

        const productName = nameProductsInventory[index];
        if (!productName) {
            console.error('Product name not found at index', index);
            return;
        }

        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = !updatedCheckedItems[index];
        setCheckedItems(updatedCheckedItems);

        let updatedNewOrder = [...newOrder];
        const existingProductIndex = updatedNewOrder.findIndex(product => product.name === productName);

        if (updatedCheckedItems[index]) {
            if (existingProductIndex === -1) {
                updatedNewOrder.push({ name: productName, quantity: 1, selected: true });
            } else {
                updatedNewOrder[existingProductIndex].selected = true;
            }
        } else {
            updatedNewOrder = updatedNewOrder.filter(product => product.name !== productName);
        }
    };

    const handleAddToOrder = (productName, quantity) => {
        if (quantity > 0) {
            setNewOrderProducts(productName, quantity);
            setModalVisible(false);
            setSelectedProduct(null);
        }
    };

    const DialogModal = () => {
        return (
            <Portal>
                <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)} style={{ height: 300, padding: 20 }}>
                    <Dropdown
                        label="Piezas"
                        placeholder="Selecciona piezas"
                        options={OPTIONS}
                        value={selectedQuantity}
                        onSelect={(value) => setSelectedQuantity(value)}
                        mode="outlined"
                    />
                    <Dialog.Actions style={{ position: 'absolute', bottom: 0, right: 0 }}>
                        <Button onPress={() => handleAddToOrder(selectedProduct, selectedQuantity)}>Agregar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Aquí puedes agregar la lógica para recargar la información de productos.
        // Por ejemplo, si tienes una función que obtenga los productos, llámala aquí.
        getNewOrderProducts()
        setTimeout(() => {
            // Simula la actualización
            setRefreshing(false);
        }, 2000);
    };

    const renderItemAccessory = (index) => {
        const product = nameProductsInventory[index];
        const orderProduct = newOrder.find(item => item.name === product.name);

        return (
            <View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                    {product.image && <Image source={{ uri: product.image }} style={{ width: 30, height: 30 }} />}
                    <CheckBox
                        status="primary"
                        checked={checkedItems[index]}
                        onChange={() => {
                            handleCheckboxChange(index);
                            setSelectedProduct(product.name);
                            setModalVisible(true);
                        }}
                    />
                    {orderProduct && orderProduct.quantity > 0 && <Text>{orderProduct.quantity}</Text>}
                </View>

            </View>
        );
    };

    const renderItem = ({ item, index }) => (
        <View style={{ display: 'flex' }}>
            <ListItem
                title={`${item.name}`}
                accessoryRight={renderItemAccessory(index)}
                style={{ display: 'flex', flexDirection: 'row', paddingRight: 70, alignItems: 'center', justifyContent: 'center' }}
            />
        </View>
    );

    const sendToWhatsApp = () => {
        // Crear un mensaje con los productos seleccionados
        const selectedProducts = newOrder
            .filter(item => item.selected)  // Filtrar los productos seleccionados
            .map(item => {
                // Verificar que item.name no sea null ni undefined antes de usarlo
                const productName = item.name ? item.name.toLowerCase() : '';  // Asegurar que sea una cadena válida

                // Asignar un emoji según el producto, si no hay coincidencia usa el emoji general 📦
                const productIcon = productName.includes('leche') ? '🥛' :
                    productName.includes('pan') ? '🍞' :
                        '📦';  // El emoji 📦 será usado como icono predeterminado

                return `${productIcon} ${item.name} - ${item.quantity} unidades`; // Cambié el "x" por "unidades"
            })  // Formatear el mensaje con íconos
            .join('\n'); // Unir los productos en un solo string

        // Formatear el mensaje en un enlace de WhatsApp
        const message = encodeURIComponent(selectedProducts); // Asegúrate de que el mensaje esté correctamente codificado
        const phoneNumber = '6692396324';  // Reemplaza con el número de teléfono al que deseas enviar el mensaje (incluye el código de país)

        const url = `https://wa.me/${phoneNumber}?text=${message}`;

        // Usar Linking para abrir la aplicación WhatsApp con el enlace
        Linking.openURL(url)
            .catch(err => console.error('Error al abrir WhatsApp', err));

        // Después de enviar el mensaje, borrar los datos:
        // Restablecer el estado del pedido a vacío

          setNewOrder([])
          removeAllOrderProducts()
        // Restablecer el estado de los elementos seleccionados a "no seleccionados"
        setCheckedItems(new Array(nameProductsInventory.length).fill(false));  // Resetea todos los checkboxes
    };





    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventory</Text>
            <FlatList
                data={nameProductsInventory}
                renderItem={renderItem}
                extraData={newOrder}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
            <DialogModal />
            <Button onPress={sendToWhatsApp}>
                Enviar a WhatsApp
            </Button>

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
});
