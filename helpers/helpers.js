import {React, useContext,useState} from 'react';
import { Button,List,ListItem,Divider,Text } from '@ui-kitten/components';
import { Icon,Portal,Dialog } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { loginContext } from '../context/context';


const ListAccessoriesShowcase = (props) => {
  const { users,getCurrentUser,setShowHome} = useContext(loginContext);
  
  const renderItemIcon = () => (
    <Icon
    source="cash-register"
    color='gray'
    size={40}
  />
  );

  const currentSales = async (id) => {
    const status = await getCurrentUser(id)
    if(status[0].value === true) {
      setShowHome(true)

    } 
  }

  const renderItem = ({ item, index }) => (
    <ListItem
      onPress={()=>{currentSales(item.id)}}
      style={[styles.container]}
      title={() => <Text style={styles.title}>{`${index + 1}   ${item.name}`}</Text>}
      accessoryRight={renderItemIcon}
    />
  );

  return (
    <>
    <List
      data={users}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
    />
    <DialogSales visible={props.dialogVisible}/>
    </>
  );
};


const DialogSales = ({visible}) => {
   const [setVisible] = useState(true)
   console.log(visible, "desde dialog visible")
   const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Actions>
          <Button onPress={() => console.log('Cancel')}>Cancel</Button>
          <Button onPress={() => console.log('Ok')}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};


const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 24
  }
});

export  {ListAccessoriesShowcase};
