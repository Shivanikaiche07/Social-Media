const User = require("../models/User");
const Post = require("../models/Post");
const { unsubscribe } = require("../routes/user");

exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      let user = await User.findOne({ email });
      if (user) 
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });


          user = await User.create({
            name,
            email,
            password,
            avatar: { public_id:"sample_id", url: "sampleurl "},
          });

          const token = await user.generateToken();

          const options = {expires:new Date(Date.now()+45*24*60*60*1000),
           httpOnly:true,
         };
       
           res.status(200).cookie("token",token,options)
           .json({
              success:true,
              user,
              token,
           });

      } catch (error){
        res.status(500).json({
            success: false,
             message: error.message,
        });
      }

};

exports.login = async (req, res) =>{
   try{
    
    const {email , password} = req.body;

    const user = await User.findOne({ email }).select("+password");

    if(!user){
      return res.status(400).json({
         success: false,
         message: "User doesn't exist"

      });

    }

    const isMatch = await user.matchPassword(password);


    if(!isMatch){
       return res.status(400).json({
          success: false,
          message: "Incorrect Password",
       });
    }

   const token = await user.generateToken();

   const options = {expires:new Date(Date.now()+45*24*60*60*1000),
    httpOnly:true,
  };

    res.status(200).cookie("token",token,options)
    .json({
       success:true,
       user,
       token,
    });

   } catch (error){
 
    res.status(500).json({
       success: false,
       message: error.message,
    });

   }
};


exports.logout = async(req, res) => {

   try {

      res.status(200)
      .cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
      .json({
         success:true,
         message:"Logged Out",
      });
      
   } catch (error) {
     
      res.status(500).json({
         success: false,
         message: error.message,
      }); 

   }



}



exports.followuser = async (req, res) => {
   try {

      const usertofollow = await User.findById(req.params.id);
      const loggedinuser = await User.findById(req.user._id);

      if(!usertofollow) {
         return res.status(400).json({
            success:false,
            message:"User not Found"
         });
      }


      if(loggedinuser.following.includes(usertofollow._id)) {


         const indexfollowing = loggedinuser.following.indexOf(usertofollow._id);
         loggedinuser.following.splice(indexfollowing,1);

         const indexfollowers = usertofollow.followers.indexOf(loggedinuser._id);
         usertofollow.followers.splice(indexfollowers,1);  
         
         await loggedinuser.save();
         await usertofollow.save();
                
         res.status(200).json({
            success:true,
            message:"UnFollowing"
         });


      }
      else
      {
         loggedinuser.following.push(usertofollow._id);
         usertofollow.followers.push(loggedinuser._id);
   
         await loggedinuser.save();
         await usertofollow.save();
   
         res.status(200).json({
            success:true,
            message:"Following"
         });

      }


      
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
};

exports.changePassword = async (req, res) => {
   try {
      
      const user = await User.findById(req.user._id).select("+password");

      const {oldPassword , newPassword} = req.body;

      if(!oldPassword || !newPassword) {
         return res.status(400).json({
            success:false,
            message:"Please provide old and new password"
         })
      }

      const isMatch = await user.matchPassword(oldPassword);

      if(!isMatch) {
         return res.status(400).json({
            success:false,
            message:"Incorrect Old Password",
         });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
         success:true,
         message:"New Password"
      })



   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}

exports.updateProfile = async(req, res) => {
   try {

      const user = await User.findById(req.user._id);

      const {name, email} = req.body;

      if(name){
         user.name = name;
      }

      if(email){
         user.email = email;
      }

      await user.save();

      res.status(200).json({
         success:true,
         message:"Profile Updated",
      });


      
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      });
   }
}

exports.deleteProfile = async(req, res) => {
   try {
      
      const user = await User.findById(req.user._id);
      const posts = user.posts;
      const followers = user.followers;
      const following = user.following;
      const userId = user._id;

      await user.deleteOne();

      res.cookie("token",null,{
         expires:new Date(Date.now()),
         httpOnly:true,
      });
      
   
      for(let i= 0; i< posts.length; i++) {
         const post = await Post.findById(posts[i]);
         await post.deleteOne();
      }


      for(let i= 0; i< followers.length; i++) {
         const follower = await User.findById(followers[i]);
         
         const index = follower.following.indexOf(userId);
         follower.following.splice(index,1);
         await follower.save();
      }

      for(let i= 0; i< following.length; i++) {
         const follows = await User.findById(following[i]);
         
         const index = follows.followers.indexOf(userId);
         follows.followers.splice(index,1);
         await follows.save();
      }
      
      res.status(200).json({
         success:true,
         message:"Profile Deleted",
      });



   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      }); 
   }
}

exports.myAccount = async (req, res) => {
   try {
      
      const user = await User.findById(req.user._id).populate("posts");

      res.status(200).json({
         success:true,
         user,
      });



   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      }); 
   }
}

exports.userAccount = async (req, res) => {
   try {
      
      const user = await User.findById(req.params._id).populate("posts");

      if(!user) {
         return res.status(400).json({
            success:false,
            message:"User not Found",
         });
      }

      res.status(200).json({
         success:true,
         user,
      });



   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      }); 
   }
}


exports.allUserAccount = async (req, res) => {
   try {
      
      const users = await User.find({});

         return res.status(200).json({
            success:true,
            users,
         });



   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message,
      }); 
   }
}
