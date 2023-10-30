import { View, Text } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { FlatList } from 'react-native-gesture-handler'
import moment from 'moment'
import { TransactionType } from '../../types/transactionType'

const ItemList: React.FC<{
  data: TransactionType[]
  limit?: number
}> = ({ data, limit }) => {
  return (
    <FlatList
      data={data.slice(0, limit)}
      renderItem={({ index, item }) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <View style={{ flex: 6 }}>
            <Text style={{ fontWeight: '600' }}>{item.itemName}</Text>
            <Text style={{ color: Colors.mute, fontSize: 12 }}>
              {moment(item.date).format('LLL')}
            </Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center', marginLeft: 20 }}>
            <Text style={{ fontWeight: '600', color: Colors.mute }}>
              {item.category}
            </Text>
          </View>
          <View style={{ flex: 4, alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '600', color: 'red' }}>
              - Rp.{item.price}
            </Text>
          </View>
        </View>
      )}
    />
  )
}

export default ItemList
