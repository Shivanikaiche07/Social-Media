const Post = require("../models/Post");
const User = require("../models/User");


exports.createPost = async (req,res) => {

    try {
        const newpostData = {
            caption:req.body.caption,
            image: {
                public_id: "req.body.public_id",
                url:"req.body.url",
            },
            owner:req.user._id,
        };

 const post = await Post.create(newpostData);

 const user = await User.findById(req.user._id);

 user.posts.push(post._id);

 await user.save();

        res.status(201).json({
            success:true,
            post,
        });

    }
     catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }


}


exports.DeletePost = async (req,res) =>{
     try {
        
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message: "Post not Found"
            });
        }

        if(post.owner.toString()!==req.user._id.toString()){
            return  res.status(401).json({
                success:false,
                message:"Unauthorize"
            });
        }

        await post.deleteOne();

        const user = await User.findById(req.user._id);

        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();

        res.status(200).json({
            success:true,
            message:"Post is Deleted Successfully",
        });


     }
      catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
     }
}



exports.PostlikeAndUnlike = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message: "Post mot Found"
            });
        }

        if(post.likes.includes(req.user._id)) {
           const index = post.likes.indexOf(req.user._id);

           post.likes.splice(index,1);

           await post.save();

           return res.status(200).json({
             success: true,
             message:"Post Unliked Successfully",
           });

        }

        else{

            post.likes.push(req.user._id);

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Liked",
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}



exports.getPostOfFollowing = async (req, res) =>{
    try {
        
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.following,
            }
        });

        res.status(200).json({
            success: true,
            posts,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
        
    }
}

exports.updateCaption = async (req, res ) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success:false,
                message: "Post mot Found"
            });
        }

        if(post.owner.toString () !== req.user._id.toString()) {
            return res.status(401).json({
                success:false,
                message: "Unauthorized"
            });
        }

        post.caption = req.body.caption;
        await post.save();

        return res.status(200).json({
            success:true,
            message:"Post Updated",
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
        
    }
}