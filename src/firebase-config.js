import firebase from 'firebase/compat/app';
import "firebase/compat/database";

const confi = {
        "type": "service_account",
        "databaseURL": "https://still-nebula-323018-default-rtdb.firebaseio.com",
        "project_id": "still-nebula-323018",
        "private_key_id": "811e72780ff26265d708ae477cb7690820767628",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCpCSWS5c8L1SUh\npGbPfwPhhgy9qhFrVe2Wf5DXrYVVuSLV3WoNEQYgaxtDaAEOwqQgWMvi11i26S/z\ntmCR5w+eA9Ac0010XqtA8/fuSvFHfhnErKjrdsN0N5V5ucoGquojOoWnQNYBZEBM\nBnpaBZye8ae2Hi3UroaQ1CrTO0JajmQq+R1lIJmfstrXogpzlFCti6v5J+VRmYV9\ncBLOW2oZpGgF5FMHiu3uLaxlVk6eBKijyUnMxsI+AC+2BBVrTimUzZujH9/PwCSe\nd/WQOTd7jKVwN2c86KZwfJ0g+tt8P/AfUy24NghlZBBgOvOctWiCCUizwpfk4ait\nnTXRfzpNAgMBAAECggEANNT2iPTJ4z1hxyOOvLDKwjy3E7qpih5HzX+egkKqR3I/\neI+lG2NkQlKnqUhC+F2OlcubIhHDmRvGEIrCoSeSYoV3kOLcNRB3vyvhpHmI8xrv\nK+D5ROsQSO0si2itw6q81njumCl0Geg/DmQB7swNOUJ3dDz3fx9zUKX3oqDFau7O\nG58jkdHESN2s5lg8Hms8ZTUQZB1rFcAzARZiqngHnN79dKZrA4PR7G29swtPXdO6\nlCgZtqgHTz+CYNYyuYPn9BeuX5rrYk9pm+jbDG1Cvz2gX8h9rodKAVe7gDgI90BE\nIeGo2EChVUsnZqIn2DImxnnqBu2+CvsB3+e7Ku9EAwKBgQDt5Vl4+cT1JsSIaTDZ\no/bT/g7UTlHytDz5x1elZqU/i05HiqtFMRnLdRlK1y5gJx/+7gdewoVDdgR2fNuB\nQJHObtnnf+wxVJw1pTEiQR6lUpowDkx4Va8iMT12emqRgodsAX35jVZfYWTmrrdB\n5tOmnxjIwx643bM9/p4qcC4CAwKBgQC15kY5UcbipclJmfbbFHlW3IYzvjwb59Bh\nBwujjc8SzhfO9ldFl2rS8inBz26lQahJc+9sqim5h7pQewim96FfoPXkJpXL0rjA\nuKtdccGqSxYrc9dheIzaF96DYRADy+At9FR8RmaJPaF7kdAZo2j6dnSjv5OOO5pc\n0xUglKjJbwKBgQDHoQUy2k2n9s9HNRZUHB5diL1C9TIZO5xLcjcfSgJzT1/x8vCE\nEI73x5zgy69T6qET2QSARTV1Bcz67Q156ggwtZ7Pf+5g+wJWlfekKgcgbi+LEgSj\nmitrwuwzxsg0sNcZECt5RVxsj5sPZR/NAnkrQiiXF/1o3kmyRT7Ol/JTpwKBgQCQ\nkwLzofy6vdw7pKTgwegjUslTrPrnjxs/UzM7/oU8RBQGSiNZS5z7JsBrq6wcqw/P\nudbtfl4FeUxrlS5uTtmzQSLPAKAEzWpMuzpw3e54pI9tX/grH36MBXa041uwOMXo\noI7Z67aplBOaPG2zQv84Oxg/4g+sd9EbwCXFrIJu/wKBgQCD28SvtLEO9I8hdyFO\nYhMSFvb6N8YPqsYVJxvNU11pzf5QVuo+bixfMCN/E5X+MYJYaNQQ/dxXlre/XKtD\nkJuIxThlNoqw37Mw4Syl/PGbTEDL1XCT9QAXn1QLUrn/z2mumeGQz7oNKSMirWh2\nsrCQ7r6VdOTPEwGyYzq6CXXSNQ==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-lodv3@still-nebula-323018.iam.gserviceaccount.com",
        "client_id": "106805985801349349991",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lodv3%40still-nebula-323018.iam.gserviceaccount.com"
};      

firebase.initializeApp(confi);

export default firebase.database();