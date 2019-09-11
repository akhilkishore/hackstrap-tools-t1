from flask import Flask, jsonify,request,render_template,make_response
from flask import *
import json 
from linkedin_api import Linkedin

app = Flask(__name__)
app.secret_key = "spc"

### Credentials ##############################################################################################################
api = Linkedin('hr.talentsourcingnow@gmail.com', 'hr123456')
##############################################################################################################################


##############################################################################################################################





def scrapSingleUser(uri):
    try:
        profile = api.get_profile(uri)
    #summary name location headline experience skills
        user_data = []
        user_data.append(uri)
        if 'firstName' in profile:
            if 'lastName' in profile:
                user_data.append(profile['firstName']+" "+profile['lastName'])
            else:
                user_data.append(profile['firstName'])
        elif 'lastName' in profile:
            user_data.append(profile['lastName'])
        else:
            user_data.append("none")
            
        if 'headline' in profile:
            user_data.append(profile['headline'])
        else:
            user_data.append("none")

        if 'industryName' in profile:
            user_data.append(profile['industryName'])
        else:
            user_data.append("none")
            
        if 'locationName' in profile:
            user_data.append(profile['locationName'])
        else:
            user_data.append("none")

        if 'summary' in profile:
            user_data.append(profile['summary'].replace("\n"," "))
        else:
            user_data.append("none")
        #name headline industry  location summary
        print(user_data)
        return user_data
        
    except:
        return False




##############################################################################################################################

##############################################################################################################################
@app.route('/')
def index():
    return render_template('home.html') #if no : calling index page

@app.route('/userScrap', methods=['POST'])
def login():
    response = request.get_json()
    print("responce shown below")
    id_list = response['data']
    print(len(id_list))
    profile_details = []
    if len(id_list) > 0:
        for x in id_list:
            xyz = scrapSingleUser(x) 
            if xyz != False:
                profile_details.append(xyz)
        return jsonify(profile_details)
    else:
        return jsonify("404")

##############################################################################################################################
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4500,debug=True) #port  4500 
