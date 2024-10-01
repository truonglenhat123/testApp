import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPosts} from '../redux/postsSlice';
import {RootState} from '../redux/store';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';

const ListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(false);

  const {posts, loading, error, more} = useSelector(
    (state: RootState) => state.posts,
  );

  useEffect(() => {
    dispatch(fetchPosts({more: null}));
  }, [dispatch]);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detail', {post: item})}
      style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const loadMore = debounce(() => {
    if (!isFetching && more) {
      setIsFetching(true);
      dispatch(fetchPosts({more})).finally(() => {
        setIsFetching(false);
      });
    }
  }, 300);

  if (loading && posts.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetching ? <ActivityIndicator size="large" color="#808080" /> : null
      }
      onScrollBeginDrag={() => setIsFetching(true)}
      onScrollEndDrag={() => setIsFetching(false)}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: 18,
  },
});

export default ListScreen;
