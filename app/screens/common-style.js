import {StyleSheet} from 'react-native';
import {SIZES, COLORS} from '../constants';

const styles = StyleSheet.create({
  sectionContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Charter Regular',
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'NoeDisplay-Bold',
    color: COLORS.darkBlue,
  },
  sectionDescription: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  separator: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.separatorBackground,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bottomSheetActionButton: {
    height: 50,
    marginHorizontal: SIZES.margin,
    borderRadius: 10,
    backgroundColor: '#EAEAEA',
    flexDirection: 'row',
    paddingHorizontal: SIZES.margin * 3,
    alignItems: 'center',
    marginBottom: 5,
  },

  bottomSheetActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },

  bottomSheetActionButtonImage: {
    height: 20,
    width: 20,
    marginRight: SIZES.margin,
  },

  itemNumber: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.darkBlue,
    paddingHorizontal: SIZES.padding,
    borderRadius: 50,
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  itemContent: {
    color: '#333',
    fontFamily: 'Charter Regular',
    fontSize: 18,
  },
});

export default styles;
