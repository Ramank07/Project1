import mongoose, {Schema} from "mongoose";
import mongooseAggregatePagination from "mongoose-aggregate-paginate-v2"

const videoSchema= new Schema({
    videoFile:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,//cloudinay k through
        required:true,
    },
    view:{
        type:Number,
        default:0,
        
    },
    isPublish:{
        type:Boolean,
        require:true
        
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
        
        
    }
    

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePagination);
export const Video= mongoose.model("Video",videoSchema);