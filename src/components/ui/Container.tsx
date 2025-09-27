import { SafeAreaView } from 'react-native';
import { ContainerProps } from '../../types';

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <SafeAreaView className={`flex flex-1 m-6 ${className}`}>
      {children}
    </SafeAreaView>
  );
};
