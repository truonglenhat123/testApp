import React from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';

const DetailScreen: React.FC<{route: any}> = ({route}) => {
  const {post} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>
        {post.selftext || 'No content available'}
      </Text>
      <Text style={styles.link} onPress={() => Linking.openURL(post.url)}>
        Read more
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    marginVertical: 10,
    fontSize: 16,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default DetailScreen;
