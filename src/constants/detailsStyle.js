// for details related styles.
export default {

    body:{
        alignItems:"center",
        width:"100%",
    },
    image:{
        width:"45%",
        resizeMode: "contain",
        aspectRatio:1,
        marginBottom:15,
        backgroundColor:"white",
        borderRadius:8,
    },
    productTitle:{
        fontSize:18,
        fontWeight:"900",
        color:"white",
        fontFamily: "serif",
        marginBottom: 15,
        textAlign:"center",
        paddingHorizontal:"10%",
    },
    threeItems_sameRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        backgroundColor:"#FFBF00",
        borderRadius:8,
        paddingVertical:10,
        paddingHorizontal:15,
        width:"90%",
        elevation:3,
        marginBottom:10,
    },
    titleContainer: {
        width: '100%',
        paddingVertical: 25,
        backgroundColor: '#091235', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 3,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#F5E8C7', 
        textTransform: 'capitalize',
    },
    threeItems_Text:{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', 
    },
    descriptionBox:{
        backgroundColor:"#D1F6FF",
        width:"90%",
        borderRadius:8,
        paddingHorizontal:20,
        paddingVertical:10,
    },    
    descriptionLabel:{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'flex-start',
        marginBottom:5,
    },
    descriptionScrollView:{
        width: '100%',
        maxHeight: 270, 
        borderRadius: 8,
    },
    descriptionText:{
        fontSize:14,
        color:"black",
        fontFamily: "serif",
        lineHeight:20,
        textAlign:'justify',
    },
}