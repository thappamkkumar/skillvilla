<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostTags extends Model
{
    use HasFactory;
		protected $table = 'post_tags';
		protected $fillable = ['post_id', 'user_id'];

}
