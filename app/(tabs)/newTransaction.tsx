import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from 'react-native'
import React, { useRef, useState } from 'react'
import Colors from '../../constants/Colors'
import RNPickerSelect from 'react-native-picker-select'
import RNDatePicker from 'react-native-date-picker'
import moment from 'moment'
import { TransactionType, category } from '../../types/transactionType'
import db from '../../db'
import Loading from '../../components/loading'
import NetInfo from '@react-native-community/netinfo'

StatusBar.setBarStyle('dark-content')
const NewTransaction = () => {
  const itemRef = useRef<TextInput>(null)
  const priceRef = useRef<TextInput>(null)
  const qtyRef = useRef<TextInput>(null)

  NetInfo.addEventListener((state) => {
    console.log('internet aman? ', state.isConnected)
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [openDatePicker, setOpenDetPicker] = useState<boolean>(false)
  const [formData, setFormData] = useState<TransactionType>({
    date: moment(new Date()).toDate(),
    quantity: 1,
    itemName: '',
    category: 'etc',
    price: 0,
  })

  const handleSubmitData = (data: TransactionType) => {
    setLoading(true)
    db.transaction.createTransaction(data).then(() => {
      setLoading(false)
      setFormData({
        date: moment(new Date()).toDate(),
        itemName: '',
        price: 0,
        quantity: 1,
        category: 'etc',
      })
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <KeyboardAvoidingView style={[styles.root]}>
      <View style={[styles.root]}>
        <View style={[styles.formContainer]}>
          <View style={[styles.inputContainer]}>
            <Text
              style={[styles.inputLabel]}
              onPress={() => itemRef.current?.focus()}
            >
              Item name
            </Text>
            <TextInput
              ref={itemRef}
              style={[styles.inputStyle]}
              value={formData.itemName}
              placeholder="item name"
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, itemName: value }))
              }
            />
          </View>
          <View style={[styles.inputContainer]}>
            <Text
              style={[styles.inputLabel]}
              onPress={() => qtyRef.current?.focus()}
            >
              quantity
            </Text>
            <View
              style={[
                styles.inputStyle,
                { flexDirection: 'row', alignItems: 'center', gap: 5 },
              ]}
            >
              <TextInput
                style={[styles.inputStyle, { flex: 1 }]}
                ref={qtyRef}
                keyboardType="numeric"
                placeholder={'1'}
                defaultValue="1"
                value={formData.quantity.toString()}
                onChangeText={(value) => {
                  console.log(value)
                  if (parseInt(value) > 1) {
                    return
                  }
                  setFormData((prev) => ({ ...prev, quantity: Number(value) }))
                }}
                maxLength={9}
              />
            </View>
          </View>
          <View style={[styles.inputContainer]}>
            <Text
              style={[styles.inputLabel]}
              onPress={() => priceRef.current?.focus()}
            >
              Price
            </Text>
            <View
              style={[
                styles.inputStyle,
                { flexDirection: 'row', alignItems: 'center', gap: 5 },
              ]}
            >
              <Text style={{ fontWeight: '600' }}>Rp.</Text>
              <TextInput
                style={[styles.inputStyle, { flex: 1 }]}
                ref={priceRef}
                keyboardType="numeric"
                placeholder={'0'}
                value={formData.price.toString()}
                onChangeText={(value) => {
                  console.log(value)
                  setFormData((prev) => ({ ...prev, price: Number(value) }))
                }}
                maxLength={9}
              />
            </View>
          </View>
          <View style={[styles.inputContainer]}>
            <Text style={[styles.inputLabel]}>Category</Text>
            <View>
              <RNPickerSelect
                items={category.map((v) => {
                  return { label: v, value: v }
                })}
                onValueChange={(category) =>
                  setFormData((prev) => ({ ...prev, category }))
                }
              />
            </View>
          </View>
          <View style={[styles.inputContainer]}>
            <Text style={[styles.inputLabel]}>Dates</Text>
            <View>
              <Pressable onPress={() => setOpenDetPicker(true)}>
                <Text style={[styles.inputStyle]}>
                  {moment(formData.date).format('LLL')}
                </Text>
              </Pressable>
              <RNDatePicker
                modal
                mode="datetime"
                locale="id"
                open={openDatePicker}
                date={formData.date as Date}
                androidVariant="nativeAndroid"
                onCancel={() => setOpenDetPicker(false)}
                onConfirm={(value) => {
                  setOpenDetPicker(false)
                  setFormData((prev) => ({
                    ...prev,
                    date: moment(value).toDate(),
                  }))
                }}
              />
            </View>
          </View>
          <Pressable
            style={[styles.submitBtn]}
            onPress={() =>
              Alert.alert('confirmation', 'save new transaction record?', [
                {
                  text: 'cancel',
                  onPress() {
                    return
                  },
                },
                {
                  text: 'Submit',
                  onPress() {
                    return handleSubmitData(formData)
                  },
                },
              ])
            }
          >
            <Text style={[{ fontWeight: '600', fontSize: 16, color: 'white' }]}>
              Submit
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default NewTransaction

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    gap: 20,
  },
  inputContainer: {
    gap: 5,
  },
  inputStyle: {
    borderBottomWidth: 1,
    borderColor: Colors.mute,
    height: 35,
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  submitBtn: {
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.background,
    borderColor: Colors.inactive,
    borderWidth: 0.5,
    elevation: 20,
  },
})
